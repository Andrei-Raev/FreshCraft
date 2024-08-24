import random
from PIL import Image
import numpy as np


def generate_mask(width, height, keep_percentage):
    # Создание черного изображения (черно-белое в оттенках серого)
    mask = Image.new('L', (width, height), 0)

    # Считаем размер центральной белой области
    keep_width = int(width * (1 - keep_percentage))
    keep_height = int(height * (1 - keep_percentage))

    # Считаем координаты центральной белой области
    center_x, center_y = width // 2, height // 2
    start_x = center_x - keep_width // 2
    end_x = center_x + keep_width // 2
    start_y = center_y - keep_height // 2
    end_y = center_y + keep_height // 2

    def linear_to_sigmoid(x: [int | float]) -> float:
        if np.any((x < 0) | (x > 1)):
            raise ValueError("Значения должны быть в диапазоне [0, 1]")
        return 1 / (1 + np.exp(-10 * (x - 0.5)))

    # Функция для расчета вероятности в зависимости от расстояния до центра
    def calculate_probability(x, y, center_x, center_y, keep_percentage=0.5):
        distance = max(abs(x - center_x) / center_x,
                       abs(y - center_y) / center_y)
        # distance = abs(y - center_y) / center_y
        probability = min((1 - distance) * keep_percentage ** -1, 1)
        # print(probability, abs(x - center_x)/ center_x* keep_percentage ** -1)
        return linear_to_sigmoid(probability)

    # Функция для постепенного осветления к краям с учетом вероятности
    def fade_edge(mask):
        pixels = mask.load()
        for y in range(height):
            for x in range(width):
                if pixels[x, y] == 0:
                    probability = calculate_probability(x, y, center_x, center_y, keep_percentage)
                    if random.random() < probability:  # Согласно вероятности
                        mask.putpixel((x, y), 255)
        return mask

    # Применяем постепенное осветление к краям
    mask = fade_edge(mask)

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            mask.putpixel((x, y), 255)

    return mask


# Параметры
width = 80
height = 60
keep_percentage = 0.15

# Генерация маски
mask = generate_mask(width, height, keep_percentage)

# # Обрезать 80% сверху маски (чтобы было красиво)
# mask = mask.crop((0, int(height * (1-keep_percentage)*1.1), width, height))

# Сохранение маски в файл
mask.save('static/images/mask437.png')

# Отображение маски
mask.show()
