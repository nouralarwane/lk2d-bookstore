from django.apps import AppConfig


class LivresConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'livres'


    def ready(self):
        # Importez les signals ici
        import livres.signals