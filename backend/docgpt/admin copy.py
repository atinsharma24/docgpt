from django.db import models
from django.contrib import admin
from .models import Document

admin.site.register(Document)


class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='docs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
