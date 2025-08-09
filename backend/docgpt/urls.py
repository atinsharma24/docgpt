# from django.contrib import admin
# from django.urls import path, include
# from .views import DocumentUploadView, AskDocumentView
# from django.conf.urls.static import static
# from .views import TestView
# from django.conf import settings


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('docgpt.urls')),
#     path('upload/', DocumentUploadView.as_view(), name='upload-document'),
#     path('ask/', AskDocumentView.as_view(), name='ask-document'),
#     path('test/', TestView.as_view(), name='test'),
# ]


# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('docgpt.api_urls')),  # include api_urls here, not docgpt.urls
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
