import { HttpRequest } from '@jying/http'

export default function (http: HttpRequest) {
  return {
    clearPermissionCache() {
      return http.get('/sys/setting/clear-permission-cache')
    },
    clearDriftFile() {
      return http.get('/sys/setting/clear-drift-file')
    }
  }
}
