
from django.conf.urls import url, include
from editor import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
	#url(r'^mensajes/$', views.mensajesList.as_view()),
	url(r'^import/$', views.mensajesList),
]

urlpatterns = format_suffix_patterns(urlpatterns)