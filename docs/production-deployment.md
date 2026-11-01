# Mac mini 운영 배포

이 구성은 병합 후 검증된 main 커밋으로 실행한다. 5-B의 테스트 실행은 최종 운영 배포가 아니다. 기존 OrbStack 방식에 맞춰 앱과 PostgreSQL 16을 별도 Compose 프로젝트와 네트워크로 실행한다. macOS Node 프로세스도 가능하지만 별도 프로세스 관리와 DB 접근 설정이 필요하다. 앱은 컨테이너 안의 `0.0.0.0:3002`에 바인딩하고 Mac에서는 `127.0.0.1:3002`에만 게시한다. DB는 호스트 포트를 게시하지 않는다. OrbStack의 다른 컨테이너 접근 경로까지 차단한다고 가정하지 않는다. 앱 자체 인증은 없고 외부 공개 전에 Cloudflare Access가 필요하다. 진단 API는 운영에서 404를 반환한다.

## 최초 배포와 갱신

1. 병합된 main의 검증된 커밋을 운영용 체크아웃에서 확인하고, 기존 서비스·포트·디스크 여유를 확인한다. 다른 Compose 프로젝트나 개발 DB를 사용하지 않는다. 이 문서의 명령은 해당 체크아웃에서 실행한다.
2. `.env.production.example`을 `.env.production`으로 복사하고 `chmod 600 .env.production`을 실행한다. 두 비밀번호는 **서로 다른 긴 영문·숫자 무작위 값**으로 바꾼다. 셸 환경에 같은 변수명이 설정돼 있으면 Compose의 env-file보다 우선할 수 있으므로 제거한다. 파일과 자격 증명은 Git·로그에 넣지 않고 안전하게 보관한다. 포트가 사용 중이면 `ATLAS_PORT`를 비어 있는 루프백 포트로 변경한다.
3. `docker compose --env-file .env.production -f compose.production.yaml build`로 고정된 커밋의 앱과 Markdown을 빌드한다. `docker compose --env-file .env.production -f compose.production.yaml up -d --wait db`로 전용 DB를 시작한다.
4. 프로젝트 이름 `it-knowledge-atlas-prod`, 서비스 `db`, DB `atlas_prod`, 계정 `atlas_owner`가 맞는지 확인한다. `docker compose --env-file .env.production -f compose.production.yaml run --rm migrate`를 실행한다. 마이그레이션은 내부 호스트와 DB·계정을 검사하고 앱 계정에 필요한 테이블 권한을 부여한다. 운영 DB를 개발 명령이나 통합 테스트 대상으로 사용하지 않는다. 스키마 변경 전 백업하고 변경 내용을 검토한다.
5. `docker compose --env-file .env.production -f compose.production.yaml up -d --wait app`을 실행한다. `docker compose --env-file .env.production -f compose.production.yaml ps`와 `http://127.0.0.1:3002`에서 오늘의 학습과 상세를 확인한다. 다른 포트를 선택했다면 주소를 바꾼다. 상태 확인은 앱 HTTP 응답과 DB 준비 상태를 나타내며 모든 기능의 정상 동작을 보장하지 않는다.
6. 콘텐츠 변경도 검증·병합된 커밋으로 위 빌드와 마이그레이션 및 앱 시작 절차를 반복한다. 콘텐츠는 이미지에 포함되며 실행 중 파일 변경이 반영되지 않는다. DB 볼륨과 개인 기록은 빌드로 초기화되지 않는다. 적용 커밋을 백업과 함께 기록한다.

DB 최초 생성 후 환경 파일만 바꿔서는 DB 비밀번호가 바뀌지 않는다. 앱 계정이 이미 있으면 마이그레이션은 비밀번호를 변경하지 않는다. 자격 증명 교체는 DB의 해당 역할과 환경 파일을 함께 변경하고 재연결을 확인한다. `down -v`, 볼륨 삭제, 초기화는 사용하지 않는다. 컨테이너 재시작 정책은 Mac 및 OrbStack 자동 기동을 보장하지 않는다.

## 백업과 복원

볼륨은 백업이 아니다. 운영 전에 백업 주기와 허용 손실량을 정하고 암호화된 Mac 외부 저장소에도 보관한다. 아래 예시는 접근 제한된 디렉터리에 덤프를 저장한다. 파일에는 개인 기록이 포함된다. 대상 DB와 출력 위치를 확인하고 기존 백업을 덮어쓰지 않는다.

```sh
umask 077
mkdir -p "$HOME/atlas-backups"
chmod 700 "$HOME/atlas-backups"
docker compose --env-file .env.production -f compose.production.yaml exec -T db pg_dump -U atlas_owner -d atlas_prod -Fc > "$HOME/atlas-backups/atlas-$(date +%Y%m%d-%H%M%S).dump"
```

명령 성공 여부와 파일 크기를 확인하고 실패한 덤프는 백업으로 취급하지 않는다. PostgreSQL 버전·배포 커밋과 콘텐츠 리비전을 별도 기록한다. `pg_dump`는 전역 역할을 포함하지 않는다. 복원은 별도의 빈 PostgreSQL 16 DB와 볼륨에서 `pg_restore --no-owner --no-privileges -U <복원계정> -d <격리DB> <백업파일>`로 수행하고 마이그레이션, 최근 복습 이력 및 앱 조회를 확인한다. 역할·권한은 별도로 재구성한다. 운영 DB에 덮어쓰지 않는다. 실제 격리 복원과 Mac 외부 보관은 개인 기록 축적 전 필수이며 수행하지 못했다면 5-D에서 확인한다.

## 5-C에 전달할 정보

선택된 호스트 루프백 주소와 포트, 앱에 자체 인증이 없다는 사실, 기존 Tunnel 및 Access 정책 확인 필요성을 전달한다. 이 단계에서는 Tunnel, DNS, Access를 변경하지 않는다. 스마트폰 외부 접근은 아직 제공되지 않는다.

5-B에서는 테스트 덤프를 같은 테스트 인스턴스의 별도 빈 DB에 복원해 복습 이력 건수를 확인했다. 별도 볼륨·인스턴스에서의 복원, 복원된 앱 연결과 Mac 외부 보관은 개인 기록 축적 전 5-D에서 확인한다.
