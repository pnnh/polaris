using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using CppCLI;
using Gliese;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace CsWinRTApp
{
    /// <summary>
    /// An empty window that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainWindow : Window
    {
        public MainWindow()
        {
            this.InitializeComponent();
        }

        private void Window_Activated(object sender, WindowActivatedEventArgs args)
        {
        }
        private void myButton_Click(object sender, RoutedEventArgs e)
        {
            myButton.Content = "Clicked";


            var stackPanel = new StackPanel();
            stackPanel.Orientation = Orientation.Horizontal;
            stackPanel.HorizontalAlignment = HorizontalAlignment.Left;
            stackPanel.VerticalAlignment = VerticalAlignment.Top;

            var newButton = new Button();
            newButton.Content = "NewButton";

            stackPanel.Children.Add(newButton);

            FilesStack.Children.Add(stackPanel);

            var aaa = Logger.Info("xxxxxx333");
            Console.WriteLine($"aaa = {aaa}");

            var fileService = new GSFilesystemService();
            var filesList = fileService.selectFiles();
            foreach (var file in filesList)
            {
                Console.WriteLine($"file name: {file.URN}");
            }
        }
    }
}
