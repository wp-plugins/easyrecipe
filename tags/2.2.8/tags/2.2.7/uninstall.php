<?php

  delete_option("ERSettings");
  $data = http_build_query(array('action' => 'uninstall', 'site' => get_site_url()));
  $fp = @fopen("http://www.easyrecipeplugin.com/installed.php?$data", "r");
?>