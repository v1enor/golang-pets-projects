package cmd

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"golang.org/x/text/encoding/charmap"
)

const URL = "http://rzhunemogu.ru/RandJSON.aspx?CType="

type Joke struct {
	Content string `json:"content"`
}

func getJoke(reguesttype string) string {
	if reguesttype == "" {
		reguesttype = "1"
	}
	response, err := http.Get(URL + reguesttype)

	if err != nil {
		log.Fatalln("Ошибка запроса : ", err)
		return ""
	}
	defer response.Body.Close()

	// Прочитаем тело ответа как Windows-1251
	decoder := charmap.Windows1251.NewDecoder()
	reader := decoder.Reader(response.Body)

	// Чтение данных из ответа
	body, err := io.ReadAll(reader)
	if err != nil {
		log.Fatalln("Ошибка чтения сообщения : ", err)
		return ""
	}

	cleanBody := strings.Replace(string(body), "\r", "\\r", -1)
	cleanBody = strings.Replace(cleanBody, "\n", "\\n", -1)
	cleanBody = strings.Replace(cleanBody, " Ð", "", -1)
	cleanBody = strings.Replace(cleanBody, " Ñ", "", -1)

	var joke Joke
	err = json.Unmarshal([]byte(cleanBody), &joke)

	if err != nil {

		return getJoke(reguesttype)
	}
	return joke.Content
}
