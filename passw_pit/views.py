import crypto
import forms
from django.views.generic import edit as edit_views


class Home(edit_views.FormView):
    template_name = 'home_login.html'
    form_class = forms.Login


class Registration(edit_views.FormView):
    template_name = 'registration.html'
    form_class = forms.Registration

    def form_valid(self, form):
        auth_models.User.objects.create(
            email=form.cleaned_data['email'],
            password=crypto.make_password(form.cleaned_data['password_hash'], form.cleaned_data['salt']),
            username=form.cleaned_data['email'],
        )
