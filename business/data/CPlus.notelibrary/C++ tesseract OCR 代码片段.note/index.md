---
title: C/C++
description: 同时使用了qt、tesseract、leptonica和opencv库
---

同时使用了qt、tesseract、leptonica和opencv库

```c++
#include <spdlog/spdlog.h>
#include <string>
#include <tesseract/baseapi.h>
#include <leptonica/allheaders.h>
#include <opencv2/opencv.hpp>
#include <stdio.h>
#include <QImage>
#include <QString>
#include <QBuffer>

#define MAXBUFLEN 1000000

// 图像二值化
bool convertToBinary(QImage &inputImage, QImage &outputImage, int threshold)
{
    QSize size = inputImage.size();
//   QImage binaryImage(size, QImage::Format_RGB32);
  int width = size.width();
  int height = size.width();
  for(int i = 0; i < size.width(); i++)
    for(int j = 0; j < size.height(); j++)
    {
      QRgb pixel = inputImage.pixel(i, j);
      int r = qRed(pixel) * 0.3;
      int g = qGreen(pixel) * 0.59;
      int b = qBlue(pixel) * 0.11;
      int rgb = r + g + b;//先把图像灰度化，转化为灰度图像
      if (rgb > threshold)//然后按某一阀值进行二值化
      {
        rgb = 255;
      }else
      {
        rgb = 0;
      }
      QRgb newPixel = qRgb(rgb, rgb, rgb);
            outputImage.setPixel(i, j, newPixel);
    }
//   binaryImage.save(binaryFile);
//   ui.grayLabel->setPixmap(QPixmap(binaryFile));
  return true;
}

PIX* makePIXFromQImage(const QString &filePath)
{
    QImage inputImage(filePath);

    // QSize size = inputImage.size();
    // QImage outputImage(size, QImage::Format_RGB32);
    // auto threshold = 125; // 常量阈值
    // convertToBinary(inputImage, outputImage, threshold);

    QByteArray ba;
    QBuffer buf(&ba);
    buf.open(QIODevice::WriteOnly);
    inputImage.save(&buf, "BMP");
    //outputImage.save(&buf, "BMP");
    return pixReadMemBmp((const l_uint8*) ba.constData(), ba.size());
}

void testOCR()
{
    std::string outText;
    std::string imgPath = "./data/18.png";
 
    // Create Tesseract object
    tesseract::TessBaseAPI *ocr = new tesseract::TessBaseAPI();
  
    // 初始化
    ocr->Init(NULL, "chi_sim", tesseract::OEM_DEFAULT);
  
    // 设置分割模式
    ocr->SetPageSegMode(tesseract::PSM_AUTO);
  
    // Open input image using OpenCV
    // Mat im = cv::imread(imPath, IMREAD_COLOR);
    // cout << "isEmpty: \n" << im.empty() << endl;
    // ocr->SetImage(im.data, im.cols, im.rows, 3, im.step);

    auto image = makePIXFromQImage(imgPath.c_str());

    ocr->SetImage(image); 

    outText = std::string(ocr->GetUTF8Text());
 
    pixDestroy(&image);
    // print recognized text
    std::cout << "outText: \n" << outText << std::endl;
 
    // Destroy used object and release memory
    ocr->End();
}
```
