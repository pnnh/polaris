using Microsoft.VisualStudio.TestTools.UnitTesting;
using Molecule.Helpers;

namespace Molecule.Tests.Helpers
{
    [TestClass]
    public class TestDateTimeHelper
    {
        [TestMethod]
        public void TestParseRfc3339()
        {
            // Arrange
            var rfc3339 = "2022-01-01T12:00:00.000Z";

            // Act
            var result = DateTimeHelper.ParseRfc3339(rfc3339);

            // Assert
            Assert.AreEqual(new DateTime(2022, 1, 1, 12, 0, 0, DateTimeKind.Utc), result);
        }
    }
}