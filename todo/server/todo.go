package main

import (
	"github.com/gofiber/fiber/v2"
)

func getTodos(c *fiber.Ctx) error {
	var todos []Todo
	result := db.Find(&todos)
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("Не найдены todo")
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": result.Error.Error()})
	}
	log.Info().Msg("Найдены todo")
	return c.JSON(todos)
}

func getTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo Todo
	result := db.Find(&todo, id)
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("Не найден todo")
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": result.Error.Error()})
	}
	log.Info().Msg("Найден todo")
	return c.JSON(todo)
}

func createTodo(c *fiber.Ctx) error {
	var todo Todo
	c.BodyParser(&todo)
	result := db.Create(&todo)
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("Ошибка при созданиие задачи")
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": result.Error.Error()})
	}
	log.Info().Msg("Успешно создана задача")
	return c.SendStatus(fiber.StatusOK)
}

func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo Todo

	result := db.Where("id = ?", id).First(&todo)
	if result.Error != nil {
		log.Error().Err(result.Error).Msg("Ошибка при обновлении задачи")
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": result.Error.Error()})
	}

	if err := c.BodyParser(&todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	log.Info().Msg("Успешно обновлено")
	db.Save(&todo)
	return c.JSON(todo)
}

func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	var todo Todo
	if err := db.First(&todo, "id = ?", id).Error; err != nil {
		log.Error().Err(err).Msg("Ошибка при удалении")
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": err.Error()})
	}

	if result := db.Delete(&todo); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": result.Error.Error()})
	}
	log.Info().Msg("Успешно удалено")
	return c.SendStatus(fiber.StatusOK)
}
