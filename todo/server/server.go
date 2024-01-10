package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/rs/zerolog"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB
var log = zerolog.New(os.Stdout).With().Timestamp().Logger().Output(zerolog.ConsoleWriter{Out: os.Stdout, NoColor: false})

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		log.Error().Err(err).Msg("Не иницилизировалась бд")
	}
	db.AutoMigrate(&Todo{})

}

type Todo struct {
	Id     string `gorm:"primary_key" json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

func main() {

	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	app := fiber.New()

	app.Use(cors.New())
	initDB()
	log.Info().Msg("DB init!")

	app.Get("/todos", getTodos)
	app.Get("/todos/:id", getTodo)
	app.Post("/todos", createTodo)
	app.Put("/todos/:id", updateTodo)
	app.Delete("/todos/:id", deleteTodo)

	// Прослушивание порта 3000
	app.Listen(":3001")
}
