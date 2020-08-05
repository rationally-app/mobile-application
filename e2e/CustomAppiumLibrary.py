from AppiumLibrary import AppiumLibrary

class CustomAppiumLibrary(AppiumLibrary):
    def get_driver_instance(self):
        return self._current_application()

    # Terminate an App Package
    def TerminateApp(self, package):
        self._current_application().terminate_app(package)    

    # Open Deep Link
    def OpenDeepLink(self, url, package):
        self.TerminateApp(package)
        self._current_application().execute_script('mobile: shell',{'command': 'am start', "args": ["-W", "-a", "android.intent.action.VIEW", "-d", url.replace('&', '\&'), package]})

    # Reference Keywords
    def KeyboardType(self, textToType):
        self._current_application().execute_script("var vKeyboard = target.frontMostApp().keyboard(); vKeyboard.typeString(\"" + textToType + "\");")

    def PressKeyboardButton(self, buttonToPress):
        self._current_application().execute_script("var vKeyboard = target.frontMostApp().keyboard(); vKeyboard.buttons()['" + buttonToPress + "'].tap();")
