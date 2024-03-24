from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button

class MyKivyApp(App):
    def build(self):
        layout = BoxLayout(orientation='vertical')

        # Empty Widget to Push Content to the Top
        top_space = BoxLayout(size_hint=(1, None), height='65dp')

        # Empty Widget to Push Content to the Bottom
        bottom_space = BoxLayout(size_hint=(1, 1))

        # Input Section
        input_layout = BoxLayout(size_hint=(1, None), height='40dp', orientation='vertical')
        label = Label(text='Enter your Date of Birth in format DDMMYYYY:', size_hint=(1, None), height='20dp')
        self.dob_input = TextInput(multiline=False, size_hint=(1, None), height='40dp', halign='center')
        analyze_button = Button(text='Analyze', on_press=self.analyze_dob, size_hint=(1, None), height='40dp')
        input_layout.add_widget(label)
        input_layout.add_widget(self.dob_input)
        input_layout.add_widget(analyze_button)

        # Result Section
        self.result_label = Label(text='Results will appear here', size_hint=(1, None), height='500dp')

        layout.add_widget(top_space)
        layout.add_widget(input_layout)
        layout.add_widget(bottom_space)
        layout.add_widget(self.result_label)

        return layout

    def analyze_dob(self, instance):
        dob = self.dob_input.text
        s1, s2, s3 = 0, 0, 0
        c = [[0, 0, 0] for _ in range(10)]

        for x in str(dob):
            s1 += int(x)
            c[int(x)][0] += 1

        for y in str(s1):
            s2 += int(y)
            c[int(y)][0] += 1

        if s2 >= 10:
            for z in str(s2):
                s3 += int(z)
                c[int(z)][0] += 1
            c[s3][0] += 1
        else:
            c[s2][0] += 1

        for w in range(1, 10):
            if c[w][0] > 3:
                c[w][1] = c[w][0] - 3
                c[w][0] = 3
            if c[w][1] > 3:
                c[w][2] = c[w][1] - 3
                c[w][2] = 3

        result_text = self.generate_result_text(c, s2, s3)
        self.result_label.text = result_text

    def generate_result_text(self, c, s2, s3):
        result_text = "+--+--+--+\n"
        for row in range(3):
            result_text += " | " + "3" * c[3][row] + (3 - c[3][row]) * " " + " | " + "6" * c[6][row] + (3 - c[6][row]) * " " + " | " + "9" * c[9][row] + (3 - c[9][row]) * " " + " | \n"
        result_text += "+--+--+--+\n"
        for row in range(3):
            result_text += " | " + "2" * c[2][row] + (3 - c[2][row]) * " " + " | " + "5" * c[5][row] + (3 - c[5][row]) * " " + " | " + "8" * c[8][row] + (3 - c[8][row]) * " " + " | \n"
        result_text += "+--+--+--+\n"
        for row in range(3):
            result_text += " | " + "1" * c[1][row] + (3 - c[1][row]) * " " + " | " + "4" * c[4][row] + (3 - c[4][row]) * " " + " | " + "7" * c[7][row] + (3 - c[7][row]) * " " + " | \n"
        result_text += "+--+--+--+\n\n"

        if s3 != 0:
            result_text += "Life path: {}\n".format(s3)
        else:
            result_text += "Life path: {}\n".format(s2)

        if s2 % 11 == 0:
            result_text += "Master number: {}\n".format(s2)
        else:
            result_text += "Master number: N/A\n"

        result_text += "\nYou have:\n"
        if c[3][0] > 0 and c[6][0] > 0 and c[9][0] > 0:
            result_text += "Row 369\n"
        if c[2][0] > 0 and c[5][0] > 0 and c[8][0] > 0:
            result_text += "Row 258\n"
        if c[1][0] > 0 and c[4][0] > 0 and c[7][0] > 0:
            result_text += "Row 147\n"
        if c[1][0] > 0 and c[2][0] > 0 and c[3][0] > 0:
            result_text += "Column 123\n"
        if c[4][0] > 0 and c[5][0] > 0 and c[6][0] > 0:
            result_text += "Column 456\n"
        if c[7][0] > 0 and c[8][0] > 0 and c[9][0] > 0:
            result_text += "Column 789\n"
        if c[1][0] > 0 and c[5][0] > 0 and c[9][0] > 0:
            result_text += "Diagonal 159\n"
        if c[3][0] > 0 and c[5][0] > 0 and c[7][0] > 0:
            result_text += "Diagonal 357\n"
        result_text += "\nYou are missing:\n"
        if c[3][0] == 0 and c[6][0] == 0 and c[9][0] == 0:
            result_text += "Row 369\n"
        if c[2][0] == 0 and c[5][0] == 0 and c[8][0] == 0:
            result_text += "Row 258\n"
        if c[1][0] == 0 and c[4][0] == 0 and c[7][0] == 0:
            result_text += "Row 147\n"
        if c[1][0] == 0 and c[2][0] == 0 and c[3][0] == 0:
            result_text += "Column 123\n"
        if c[4][0] == 0 and c[5][0] == 0 and c[6][0] == 0:
            result_text += "Column 456\n"
        if c[7][0] == 0 and c[8][0] == 0 and c[9][0] == 0:
            result_text += "Column 789\n"
        if c[1][0] == 0 and c[5][0] == 0 and c[9][0] == 0:
            result_text += "Diagonal 159\n"
        if c[3][0] == 0 and c[5][0] == 0 and c[7][0] == 0:
            result_text += "Diagonal 357\n"
        result_text += "\n"
        if c[5][0] == 0:
            if c[2][0] == 0 and c[4][0] == 0 and c[1][0] > 0:
                result_text += "Isolated corner 1\n"
            if c[2][0] == 0 and c[6][0] == 0 and c[3][0] > 0:
                result_text += "Isolated corner 3\n"
            if c[4][0] == 0 and c[8][0] == 0 and c[7][0] > 0:
                result_text += "Isolated corner 7\n"
            if c[6][0] == 0 and c[8][0] == 0 and c[9][0] > 0:
                result_text += "Isolated corner 9\n"

        return result_text

if __name__ == '__main__':
    MyKivyApp().run()

