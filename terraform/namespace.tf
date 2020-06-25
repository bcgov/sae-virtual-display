resource "kubernetes_namespace" "default" {
  metadata {
    annotations = {
      name = var.namespace
    }
    name = var.namespace
  }
}
