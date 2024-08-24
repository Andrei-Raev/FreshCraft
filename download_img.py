# import requests
# import os
#
#
# def download_images(links, download_folder):
#     os.makedirs(download_folder, exist_ok=True)  # Создаем папку для загрузок, если она не существует
#
#     for index, link in enumerate(links):
#         response = requests.get(link)
#         response.raise_for_status()  # Проверяем успешность запроса
#
#         # Определяем имя файла из ссылки
#         file_name = os.path.join(download_folder,
#                                  f'image_{index + 1}.jpg')  # или используйте os.path.basename(link) для извлечения имени файла из ссылки
#
#         # Сохраняем изображение в файл
#         with open(file_name, 'wb') as file:
#             file.write(response.content)
#         print(f'Изображение сохранено: {file_name}')
#
#
# # Пример массива ссылок на изображения
# links = [f'https://freshcraft.org/assets/images/posters/poster ({i}).webp' for i in range(1, 50)]
#
# # Путь к папке, в которую сохраняются изображения
# download_folder = 'downloaded_images'
#
# download_images(links, download_folder)
from PIL import Image


def black_white_to_alpha(input_image_path, output_image_path, r, g, b):
    # Открываем черно-белое изображение
    image = Image.open(input_image_path).convert("L")

    # Создаем новое изображение в формате RGBA
    width, height = image.size
    new_image = Image.new("RGBA", (width, height), (r, g, b, 0))

    # Преобразуем черно-белое изображение в альфа канал
    for x in range(width):
        for y in range(height):
            alpha = image.getpixel((x, y))
            new_image.putpixel((x, y), (r, g, b, alpha))

    # Сохраняем новое изображение
    new_image.save(output_image_path)


# Задаем значения для каналов RGB
r, g, b = 17, 17, 17

# Пути к входному и выходному изображениям
input_image_path = r'C:\Users\andre\Desktop\FreshCraft\static\images\mask_header.png'
output_image_path = r'C:\Users\andre\Desktop\FreshCraft\static\images\ragged-header-mask.png'

# Преобразуем изображение
black_white_to_alpha(input_image_path, output_image_path, r, g, b)
