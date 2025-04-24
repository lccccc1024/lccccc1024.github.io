# 添加API请求重试机制
GitHubMetadata::Client.pages = lambda do |repo, options|
  retries ||= 0
  @client.pages(repo, options)
rescue Octokit::TooManyRequests => e
  sleep(e.response.headers['retry-after'].to_i)
  retry if (retries += 1) < 3
end