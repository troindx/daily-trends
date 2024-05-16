resource "null_resource" "docker_compose" {
  provisioner "remote-exec" {
    inline = [
      "git clone https://github.com/troindx/daily-trends.git",
      "cd daily-trends",
      "git pull",
      "npm install",
      "cp .env.dist .env",
      "npx playwright install",
      "npm run build",
      "docker compose -f ./full.docker-compose.yml up -d",
    ]
    connection {
      type     = "ssh"
      user     = var.ssh_username
      password = var.ssh_password
      host     = var.ssh_host
    }
  }
}