# Generated by Django 3.1.12 on 2023-08-07 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('local_users', '0004_auto_20230803_2315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]