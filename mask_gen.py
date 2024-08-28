"""
This module provides a function to generate a mask for image processing.

The mask is created by defining a central area that 'keeps' a specified percentage of the original image,
with a fade effect applied to the edges to ensure a smooth transition.

Usage Example:
    width = 80
    height = 60
    keep_percentage = 0.15
    mask = generate_mask(width, height, keep_percentage)
    mask.save('path/to/save/mask.png')

Dependencies:
    - PIL (Pillow library) for image manipulation.
    - NumPy for mathematical operations.
    - Random module for probabilistic calculation.
"""
import random
from PIL import Image
import numpy as np


def generate_mask(width: int, height: int, keep_percentage: float) -> Image.Image:
    """
    Generates a mask with a central area defined by keep_percentage and faded edges.

    :param width: The width of the mask.
    :param height: The height of the mask.
    :param keep_percentage: The percentage of the central area to keep (between 0 and 1).
    :return: An Image object representing the generated mask.
    """
    mask = Image.new('L', (width, height), 0)

    keep_width = int(width * (1 - keep_percentage))
    keep_height = int(height * (1 - keep_percentage))

    center_x, center_y = width // 2, height // 2
    start_x = center_x - keep_width // 2
    end_x = center_x + keep_width // 2
    start_y = center_y - keep_height // 2
    end_y = center_y + keep_height // 2

    def linear_to_sigmoid(x: [int, float]) -> float:
        """
        Converts a linear input in the range [0, 1] to a sigmoid output.

        :param x: Input value(s) to convert.
        :return: Sigmoid transformed value.
        :raises ValueError: If input values are outside the [0, 1] range.
        """
        if np.any((x < 0) | (x > 1)):
            raise ValueError("Values must be in the range [0, 1]")
        return 1 / (1 + np.exp(-10 * (x - 0.5)))

    def calculate_probability(x: int, y: int, center_x: int, center_y: int, keep_percentage: float = 0.5) -> float:
        """
        Calculates the probability of keeping a pixel based on its distance to the center.

        :param x: X coordinate of the pixel.
        :param y: Y coordinate of the pixel.
        :param center_x: X coordinate of the center.
        :param center_y: Y coordinate of the center.
        :param keep_percentage: The base percentage of pixels to keep.
        :return: The probability of retaining the pixel.
        """
        distance = max(abs(x - center_x) / center_x, abs(y - center_y) / center_y)
        probability = min((1 - distance) * keep_percentage ** -1, 1)
        return linear_to_sigmoid(probability)

    def fade_edge(mask_img: Image.Image) -> Image.Image:
        """
        Applies a fade effect to the edges of the mask based on calculated probabilities.

        :param mask_img: The mask to modify.
        :return: The modified mask with faded edges.
        """
        pixels = mask_img.load()
        for y in range(height):
            for x in range(width):
                if pixels[x, y] == 0:
                    probability = calculate_probability(x, y, center_x, center_y, keep_percentage)
                    if random.random() < probability:
                        mask_img.putpixel((x, y), 255)
        return mask_img

    mask = fade_edge(mask)

    for y in range(start_y, end_y):
        for x in range(start_x, end_x):
            mask.putpixel((x, y), 255)

    return mask


# Parameters
width = 80
height = 60
keep_percentage = 0.15

mask = generate_mask(width, height, keep_percentage)

mask.save('static/images/mask437.png')

mask.show()
