/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// getjokeCmd represents the getjoke command
var getjokeCmd = &cobra.Command{
	Use:   "getjoke",
	Short: "Получить анекдот",
	Long: `
	1 - Анекдот;
	2 - Рассказы;
	3 - Стишки;
	4 - Афоризмы;
	5 - Цитаты;
	6 - Тосты;
	8 - Статусы;
	11 - Анекдот (+18);
	12 - Рассказы (+18);
	13 - Стишки (+18);
	14 - Афоризмы (+18);
	15 - Цитаты (+18);
	16 - Тосты (+18);
	18 - Статусы (+18);`,
	Run: func(cmd *cobra.Command, args []string) {

		if len(args) == 0 {
			fmt.Println(getJoke("1"))
		} else {
			fmt.Println(getJoke(args[0]))
		}

	},
}

func init() {
	rootCmd.AddCommand(getjokeCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// getjokeCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// getjokeCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
