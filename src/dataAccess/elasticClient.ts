import * as elasticsearch from 'elasticsearch';

export class ElasticClient {
  static client: elasticsearch.Client = ElasticClient.elasticClient();
  static elasticClient() {
    return new elasticsearch.Client({
      hosts: 'localhost:9200',
      log: 'error'
    });
  }
}