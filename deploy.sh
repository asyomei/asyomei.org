echo '===> Create tar.gz'
tar -czf dist.tar.gz -C dist .

echo '===> Deploy'
curl https://sewa.asyomei.org/deploy/asyomei.org -F password="$DEPLOY_PASSWORD" \
  -F name="$NAME" -F dist=@dist.tar.gz -F outpath="$OUTPATH"
