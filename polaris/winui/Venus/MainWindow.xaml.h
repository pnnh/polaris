#pragma once

#include "MainWindow.g.h"

namespace winrt::Venus::implementation
{
    struct MainWindow : MainWindowT<MainWindow>
    {
        MainWindow();

        Windows::Foundation::Collections::IVector<Windows::Foundation::IInspectable> Images() const
        {
            return m_images;
        }

        void ImageGridView_ContainerContentChanging(
            Microsoft::UI::Xaml::Controls::ListViewBase const& sender,
            Microsoft::UI::Xaml::Controls::ContainerContentChangingEventArgs const& args);
        
        void ImageGridView_GridViewSizeChanged(Windows::Foundation::IInspectable const& sender, Microsoft::UI::Xaml::SizeChangedEventArgs const& e);

    private:
        Windows::Foundation::Collections::IVector<IInspectable> m_images{ nullptr };

        Windows::Foundation::IAsyncAction GetItemsAsync();
        Windows::Foundation::IAsyncOperation<Venus::ImageFileInfo> LoadImageInfoAsync(Windows::Storage::StorageFile);
        
        fire_and_forget ShowImage(
            Microsoft::UI::Xaml::Controls::ListViewBase const& sender,
            Microsoft::UI::Xaml::Controls::ContainerContentChangingEventArgs const& args);
    };
}

namespace winrt::Venus::factory_implementation
{
    struct MainWindow : MainWindowT<MainWindow, implementation::MainWindow>
    {
    };
}
