import { Request, Response } from "express";

export class createImageController {
  static async create(req: Request, res: Response) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Comprovante de Pagamento - SICREDI</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
          }
          canvas {
            border: 1px solid #ccc;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <canvas id="canvas"></canvas>

        <script>
          const canvas = document.getElementById("canvas");
          const ctx = canvas.getContext("2d");

          function getUrlParameter(name) {
            name = name.replace(/[\\[\\]]/g, '\\\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
            const results = regex.exec(window.location.href);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\\+/g, ' '));
          }

          const nome = getUrlParameter('nome') || "";
          const cpf = getUrlParameter('cpf') || "";

          const now = new Date();
          const data = now.toLocaleDateString('pt-BR');
          const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

          const image = new Image();
          image.crossOrigin = "Anonymous";
          image.src = "https://i.ibb.co/whwZwbDj/comprovante-base.png"; // A base de comprovante

          const logo = new Image();
          logo.src = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Sicredi-logo.png"; // Logo nova do Sicredi que você mandou

          image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            // Apagar o header antigo com um retângulo branco
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, 210);

            // Desenhar a logo do Sicredi
            logo.onload = function() {
              ctx.drawImage(logo,80, 50, 250, 100); // Ajusta se precisar

              // Escrever o novo CNPJ e Banco
              ctx.font = "bold 15px Arial";
              ctx.fillStyle = "#000";
              ctx.textAlign = "center";
              ctx.fillText("BANCO COOPERATIVO SICREDI S.A.", canvas.width / 2, 190);

                // Escrever o novo CNPJ e Banco
              ctx.font = "bold 15px Arial";
              ctx.fillStyle = "#000";
              ctx.textAlign = "center";
              ctx.fillText("CNPJ 01.181.521/0001-55", canvas.width / 2, 210);

           

              // Apagar o header antigo com um retângulo branco
            ctx.fillStyle = "white";
            ctx.fillRect(3, 480, canvas.width, 40);

                 // Escrever o novo CNPJ e Banco
              ctx.font = "bold 15px Arial";
              ctx.fillStyle = "#000";
              ctx.textAlign = "center";
              ctx.fillText("BANCO COOPERATIVO SICREDI S.A.", canvas.width / 3 + 15, 500);

          

              // Informações Dinâmicas
              ctx.textAlign = "start";
              ctx.fillStyle = "#000";
              ctx.font = "17px Arial";
              ctx.fillText(data, 16, 360);       // Data
              ctx.fillText(hora, 348, 360);       // Hora
              ctx.fillText(nome, 17, 570);        // Beneficiário
              ctx.fillText(cpf, 17, 640);         // CPF
            };
          };

          image.onerror = function() {
            console.error("Erro ao carregar a imagem");
            ctx.fillStyle = "red";
            ctx.font = "20px Arial";
            ctx.fillText("Erro: Imagem não carregada", 50, 50);
          };
        </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  }
}
