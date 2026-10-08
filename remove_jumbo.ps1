\ = Get-Content 'pages/galeri.vue' -Raw
\ = \ -replace '<PageHeader title="Galeri PPID" />\r?\n', ''
\ = \ -replace 'import PageHeader from ''@/components/PageHeader\.vue''\r?\n', ''
Set-Content 'pages/galeri.vue' -Value \
