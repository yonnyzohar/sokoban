function Keyboard() {
    var self = this;
    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == Keyboard.UP) {
            // up arrow
            self.dispatchEvent("UP_PRESSED");
        }

        if (e.keyCode == Keyboard.DOWN) {
            self.dispatchEvent("DOWN_PRESSED");


        } else if (e.keyCode == Keyboard.LEFT) {
            self.dispatchEvent("LEFT_PRESSED");

        } else if (e.keyCode == Keyboard.RIGHT) {
            self.dispatchEvent("RIGHT_PRESSED");
        }

        trace(e);
    }
}

Keyboard.UP = '38';
Keyboard.DOWN = '40';
Keyboard.LEFT = '37';
Keyboard.RIGHT = '39';

Keyboard.inheritsFrom(EventDispatcher);