using CppCLI;

namespace CSharpConsole
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // 调用来自C++/CLI的函数
            Logger.Info("Hello, World!");




            // 调用来自C++/WinRT的函数
            var x = new SimpleMathComponent.SimpleMath();

            var addSum = x.add(5.5, 6.5);
            Console.WriteLine($"Adding 5.5 + 6.5 = {addSum}");

        }
    }
}
