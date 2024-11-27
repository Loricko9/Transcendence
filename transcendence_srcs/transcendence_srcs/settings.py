"""
Django settings for transcendence_srcs project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-p137f&8iautjsybygl)_3kc0(r)(+smeu3_v^r%13csbdg--&^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
	"transcendence-42.fr",
	"www.transcendence-42.fr",
	"django",
	"nginx",
	"localhost",
]

# Application definition

INSTALLED_APPS = [
	# 'django.contrib.sites',
	# 'allauth',
	# 'allauth.account',
	# 'allauth.socialaccount',
	"django_prometheus",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'frontend',
	'api',
	'register',
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'django_prometheus.middleware.PrometheusAfterMiddleware',
]

ROOT_URLCONF = 'transcendence_srcs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
				'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'transcendence_srcs.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
		'NAME': os.getenv('DATABASE_NAME'),
		'USER': os.getenv('DATABASE_USER'),
		'PASSWORD': os.getenv('DATABASE_PASSWORD'),
		'HOST': os.getenv('DATABASE_HOST', 'localhost'),
		'PORT': os.getenv('DATABASE_PORT', '5432')
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# AUTHENTICATION_BACKENDS = [
#     'django.contrib.auth.backends.ModelBackend',  # Pour l'authentification standard
#     'allauth.account.auth_backends.AuthenticationBackend',  # Pour allauth
# ]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'fr-fr'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
	os.path.join(BASE_DIR, 'transcendence_srcs/static'),
	os.path.join(BASE_DIR, 'frontend/static/css'),
	os.path.join(BASE_DIR, 'frontend/static/js'),
	os.path.join(BASE_DIR, 'frontend/static/css/Game_css'),
]

STATIC_ROOT = '/app/staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

AUTH_USER_MODEL = 'api.User_tab'

SESSION_COOKIE_SECURE = True # N'envoie le cookie que sur HTTPS
CSRF_COOKIE_SECURE = True  # N'envoie le cookie CSRF que sur HTTPS
SESSION_COOKIE_AGE = 1209600  # 2 semaines en secondes
SESSION_COOKIE_HTTPONLY = False

# Utilisez la politique SameSite pour les cookies
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = [
    'http://localhost',
    'https://localhost',
    'http://127.0.0.1',
    'https://127.0.0.1'
]



LOGIN_REDIRECT_URL = '/'
# LOGOUT_REDIRECT_URL = '/'
# ACCOUNT_UNIQUE_EMAIL = True
# # Exiger la validation par email
# ACCOUNT_EMAIL_VERIFICATION = "mandatory"  # Exige la vérification par email
# # Utiliser l'email comme identifiant
# ACCOUNT_AUTHENTICATION_METHOD = 'email'
# ACCOUNT_EMAIL_REQUIRED = True

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# SECURE_SSL_REDIRECT = True

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 3600  # Durée de vie d'une heure

# Activez HSTS (HTTP Strict Transport Security)
# SECURE_HSTS_SECONDS = 31536000  # 1 an
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# SITE_ID = 1
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('ADMIN_EMAIL')
SITE_URL = 'https://localhost'


DEFAULT_CHARSET = 'utf-8'
DEFAULT_CONTENT_TYPE = 'text/html'