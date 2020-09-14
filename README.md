# Live Preview Action
An action that enables you to live preview your app from your github workflow without deploying by exposing local web server to internet.

To use this action you can see the following sample:

```yml
on: [push]

jobs:
  live_preview_job:
    runs-on: ubuntu-latest
    name: A job to test live preview
    steps:
    - uses: actions/checkout@master
      name: Checkout
    - name: My Live Preview Action for port 5000
      uses: sharadcodes/live-preview-action@v0.1
      with:
        port: 5000 # A required field, this port will be exposed
        minutes: 1 # A required field, after the minutes specified here the server will stop
        command: "python3 -m http.server 5000" 
        # A required field, command should start the server
        # You can chain multiple commands using: && incase you want to build and then start the server
        discord_webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
        # A required field, and it will be used to send the URL for the exposed port
```
