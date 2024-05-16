variable "ssh_username" {
  description = "SSH username for remote machine"
  type        = string
  sensitive   = true
}

variable "ssh_password" {
  description = "SSH password for remote machine"
  type        = string
  sensitive   = true
}

variable "ssh_host" {
  description = "SSH HOST for remote machine"
  type        = string
  sensitive   = true
}