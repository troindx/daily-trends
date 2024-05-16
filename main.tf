resource "null_resource" "docker_compose" {
  provisioner "remote-exec" {
    inline = [
      "rm -rf daily-trends",
      "git clone https://github.com/troindx/daily-trends.git",
      "cd daily-trends",
      "git pull",
      "npm install",
      "cp ./.env.dist .env",
      "docker compose -f ./full.docker-compose.yml down || true",
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