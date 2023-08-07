# Generated by Django 3.1.12 on 2023-08-03 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('local_users', '0003_auto_20230803_1416'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_img',
            field=models.ImageField(blank=True, null=True, upload_to='posts/%Y%m%d'),
        ),
    ]
