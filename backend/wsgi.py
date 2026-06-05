from app import create_app, extensions

app = create_app()

if __name__ == '__main__':
    extensions.socketio.run(app, debug=True)
