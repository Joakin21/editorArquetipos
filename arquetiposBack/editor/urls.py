
from django.conf.urls import url, include
from editor import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
	#url(r'^mensajes/$', views.mensajesList.as_view()),
	url(r'^paraListaArquetipos/$', views.paraListaArquetipos),
	url(r'^paraEditorArquetipos/(?P<question_id>[\w\-]+)/$', views.paraEditorArquetipos)
]

urlpatterns = format_suffix_patterns(urlpatterns)