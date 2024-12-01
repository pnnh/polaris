using Microsoft.VisualStudio.TestTools.UnitTesting;
using Molecule.Helpers;

namespace Molecule.Tests.Helpers
{
    [TestClass]
    public class TestEnumHelper
    {
        enum CaseTypeEnum
        {
            [System.ComponentModel.Description("普通场景")] Normal = 0,
            [System.ComponentModel.Description("异常场景")] Exception = 1,
            [System.ComponentModel.Description("其他场景")] Other = 2
        }

        [TestMethod]
        public void TestGetEnumDescription()
        {
            // Arrange
            var normalCase = CaseTypeEnum.Normal;
            var exceptionCase = CaseTypeEnum.Exception;
            var otherCase = CaseTypeEnum.Other;

            // Act
            var normalDescription = EnumHelper.GetEnumDescription(normalCase);
            var exceptionDescription = EnumHelper.GetEnumDescription(exceptionCase);
            var otherDescription = EnumHelper.GetEnumDescription(otherCase);

            // Assert
            Assert.AreEqual("普通场景", normalDescription);
            Assert.AreEqual("异常场景", exceptionDescription);
            Assert.AreEqual("其他场景", otherDescription);
        }
    }
}