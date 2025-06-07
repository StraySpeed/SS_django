# Django Website Project
Django를 이용한 웹사이트 프로젝트

# Language
Python == 3.10
JavaScript

# Library
Django == 5.2.2
gunicorn (배포 시 필요 / wsgi)

# Website Address
https://strayspeed.duckdns.org

------
## Python Django를 이용한 웹사이트 프로젝트

### 배포하기 전에

#### 1. config/settings.py 설정하기
```python
# config/settings.py

# 디버그 끄기
DEBUG = False
# 호스트에 사용할 주소 등록 필요
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'strayspeed.duckdns.org']
```
static 파일들이 제대로 반영되기 위해 staticfiles를 만들고 settings.py에 연결해야 함
```bash
# staticfiles 폴더가 생성됨
python manage.py collectstatic
```

```python
# config/settings.py
...
# 중간에 해당 코드를 추가
import os
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
...
```

#### 2. 서버 설정
GCP EC2 인스턴스를 이용해서 사이트를 돌리는 중
*참고 - Django 자체에서 서버 구동을 지원함*
```bash
python manage.py runserver
```

현재는 Nginx + gunicorn을 이용해서 웹사이트를 구동중임
```bash
gunicorn --bind 0.0.0.0:8000 $DJANGO_MODULE
```

```bash
!#/etc/nginx/sites-available/ss-django

limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    server_name strayspeed.duckdns.org; # 서버 주소

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        root /home/ss-django;
    }

    location /media/ {
        root /home/ss-django;
    }

    location / {
	include proxy_params;
	proxy_pass http://0.0.0.0:8000;

	limit_req zone=mylimit burst=10 nodelay;
	limit_req_status 429;
    }
}
```
```bash
# ss-django 설정을 sites-enabled과 소프트링크
sudo ln -s /etc/nginx/sites-available/ss-django /etc/nginx/sites-enabled
# nginx 테스트
sudo nginx -t
# nginx 재시작
sudo systemctl restart nginx
```

아니면 systemd로 Gunicorn 서비스 등록해도 됨
```bash 
!#/etc/systemd/system/gunicorn.service

[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User={유저명}   # 유저명
Group=www-data
WorkingDirectory={프로젝트 경로}    # 프로젝트 경로
ExecStart={gunicorn 위치} \     # gunicorn 위치 -> 가상환경일 경우 {프로젝트 경로}/venv/bin/gunicorn
          --access-logfile - \
          --workers 3 \
          --bind 0.0.0.0:8000 \
          config.wsgi:application # 프로젝트 내의 wsgi 패키지

[Install]
WantedBy=multi-user.target
``` 

```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

#### 3. 포트 확인
HTTP(80), HTTPS(443) 포트 열기


------
### 참고사항 - HTTPS 인증
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```