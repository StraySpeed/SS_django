from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def custom_404(request, exception=None):
    return render(request, '404.html', status=404)

def custom_500(request, exception=None):
    return render(request, '500.html', status=404)

def custom_403(request, exception=None):
    return render(request, '403.html', status=404)

def custom_400(request, exception=None):
    return render(request, '400.html', status=404)