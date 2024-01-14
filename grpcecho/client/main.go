package main

import (
	"context"
	"grpcecho/pb"
	"html/template"
	"net/http"
	"time"

	"google.golang.org/grpc"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.New("form").Parse(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>gRPC Echo</title>
			</head>
			<body>
				<form action="/echo" method="post">
					<label for="message">Твое имя:</label><br>
					<input type="text" id="message" name="message"><br>
					<input type="submit" value="Подтвердить">
				</form>
				<p id="response"></p>
			</body>
			</html>
		`))

		tmpl.Execute(w, nil)
	})

	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		message := r.FormValue("message")

		conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure(), grpc.WithBlock())
		if err != nil {
			http.Error(w, "Failed to connect to gRPC server", http.StatusInternalServerError)
			return
		}
		defer conn.Close()

		c := pb.NewHelloServiceClient(conn)
		ctx, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()

		resp, err := c.SayHello(ctx, &pb.HelloRequest{Greeting: message})
		if err != nil {
			http.Error(w, "Failed to get response from gRPC server", http.StatusInternalServerError)
			return
		}

		w.Write([]byte(resp.GetReply()))
	})

	http.ListenAndServe(":8080", nil)
}
