#include "pch.h"
#include "MainWindow.xaml.h"
#if __has_include("MainWindow.g.cpp")
#include "MainWindow.g.cpp"
#endif

#include "ImageFileInfo.h"
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>
#include <algorithm>

namespace winrt
{
    using namespace Windows::ApplicationModel;
    using namespace Windows::Foundation;
    using namespace Windows::Foundation::Collections;
    using namespace Windows::Storage;
    using namespace Windows::Storage::Search;
    using namespace Microsoft::UI::Xaml;
    using namespace Microsoft::UI::Xaml::Controls;
}

using namespace winrt;
using namespace Microsoft::UI::Xaml;

namespace winrt::Venus::implementation
{
    MainWindow::MainWindow() :
        m_images(winrt::single_threaded_observable_vector<IInspectable>())
    {
        InitializeComponent();
        GetItemsAsync();
    }

    IAsyncAction MainWindow::GetItemsAsync()
    {
        StorageFolder appInstalledFolder = Package::Current().InstalledLocation();
        StorageFolder picturesFolder = co_await appInstalledFolder.GetFolderAsync(L"Assets\\Samples");

        auto result = picturesFolder.CreateFileQueryWithOptions(QueryOptions());

        IVectorView<StorageFile> imageFiles = co_await result.GetFilesAsync();
        for (auto&& file : imageFiles)
        {
            Images().Append(co_await LoadImageInfoAsync(file));
        }

        ImageGridView().ItemsSource(Images());
    }

    IAsyncOperation<Venus::ImageFileInfo> MainWindow::LoadImageInfoAsync(StorageFile file)
    {
        auto sink = std::make_shared<spdlog::sinks::msvc_sink_mt>();
        auto logger = std::make_shared<spdlog::logger>("msvc_logger", sink);
        logger->critical("Use output to view this message.");

        // 以下日志不会输出到Output窗口
        spdlog::debug("i love c++1");
        spdlog::info("i love c++2");
        spdlog::error("i love c++3");
        auto properties = co_await file.Properties().GetImagePropertiesAsync();
        Venus::ImageFileInfo info(properties,
            file, file.DisplayName(), file.DisplayType());
        co_return info;
    }

    void MainWindow::ImageGridView_ContainerContentChanging(ListViewBase const& sender, ContainerContentChangingEventArgs const& args)
    {
        if (args.InRecycleQueue())
        {
            auto templateRoot = args.ItemContainer().ContentTemplateRoot().try_as<Grid>();
            auto image = templateRoot.FindName(L"ItemImage").try_as<Image>();
            image.Source(nullptr);
        }
        if (args.Phase() == 0)
        {
            args.RegisterUpdateCallback({ this, &MainWindow::ShowImage });
            args.Handled(true);
        }
    }

    void MainWindow::ImageGridView_GridViewSizeChanged(Windows::Foundation::IInspectable const& sender, SizeChangedEventArgs const& e) {
       // spdlog::info("ImageGridView_GridViewSizeChanged");
        double a = std::floor(e.NewSize().Width / 200);
        auto columns = std::max(1.0, a);
        auto panel = sender.try_as<ListViewBase>().ItemsPanelRoot().try_as<ItemsWrapGrid>();
        panel.MaximumRowsOrColumns(columns);
        panel.ItemWidth(e.NewSize().Width / columns);
    }


    fire_and_forget MainWindow::ShowImage(ListViewBase const& sender, ContainerContentChangingEventArgs const& args)
    {
        if (args.Phase() == 1)
        {
            // It's phase 1, so show this item's image.
            auto templateRoot = args.ItemContainer().ContentTemplateRoot().try_as<Grid>();
            auto image = templateRoot.FindName(L"ItemImage").try_as<Image>();
            auto item = args.Item().try_as<Venus::ImageFileInfo>();
            image.Source(co_await get_self<Venus::implementation::ImageFileInfo>(item)->GetImageThumbnailAsync());
        }
    }
}
