# Generated by Django 4.2.4 on 2023-08-13 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('bubbles', '0001_initial'),
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bubble',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.room'),
        ),
    ]