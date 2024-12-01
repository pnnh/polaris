using Microsoft.VisualStudio.TestTools.UnitTesting;
using Molecule.Helpers;
using System.Text;
using System.Text.Json;

namespace Molecule.Tests.Helpers
{
    [TestClass]
    public class TestJsonHelper
    {
        [TestMethod]
        public async Task TestGetString()
        {
            // Arrange
            var jsonString = "{\"name\": \"John\", \"age\": 30}";
            var myByteArray = System.Text.Encoding.UTF8.GetBytes(jsonString);
            var ms = new MemoryStream(myByteArray);
            var jsonHelper = await JsonHelper.NewAsync(ms);

            // Act
            var result = jsonHelper.GetString("name");
            // Assert
            Assert.AreEqual("John", result);
        }
    }
}