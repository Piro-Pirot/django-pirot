# Generated by Django 3.1.12 on 2023-08-05 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('channels', '0005_channel_default_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channel',
            name='default_image',
            field=models.ImageField(blank=True, default='default_profile/default_profile.png', upload_to='default_profile/%Y%m%d'),
        ),
    ]
