# Virtual Display for RStudio

## Installation

```
docker build . -t vdi-session-rstudio
docker tag vdi-session-rstudio ikethecoder/vdi-session-rstudio:0.8.2.1
docker tag vdi-session-rstudio ikethecoder/vdi-session-rstudio:latest
docker push ikethecoder/vdi-session-rstudio

```

## Verify Container Image

```
docker run --rm --name rstudio vdi-session-rstudio
```

## Verify Spark in Container Image

```
docker run -ti -v `pwd`/_tmp:/tmp --entrypoint /bin/bash vdi-session-rstudio

-- add the Root CA
echo '-----BEGIN CERTIFICATE-----
MIIGRzCCBC+gAwIBAgIUMUiDD7N23tU9JSDvTXuUyl7zU6EwDQYJKoZIhvcNAQEL
BQAwaDE0MDIGA1UEChMrRGF0YSBJbm5vdmF0aW9uIFByb2dyYW1tZSAoZGV2MTYu
YmJzYWUueHl6KTEOMAwGA1UECxMFUFJPT0YxIDAeBgNVBAMTF2RldjE2LmJic2Fl
Lnh5eiBSb290IENBMB4XDTE5MTIxMzAzMDUzOFoXDTIxMDgxMjExMDYwMlowaDE0
MDIGA1UEChMrRGF0YSBJbm5vdmF0aW9uIFByb2dyYW1tZSAoZGV2MTYuYmJzYWUu
eHl6KTEOMAwGA1UECxMFUFJPT0YxIDAeBgNVBAMTF2RldjE2LmJic2FlLnh5eiBS
b290IENBMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6xBpRyKXfUPd
Ko49/UYF6K3vkay7gpgDD7UjJdpqEc0zBHbo39SOaUBNhj99n5LuZWQyxsA1q9uw
t/2oM3UMz9oKqa2hSaF1zL9AUB+M9C+j+aD877DZmGtJucKstHHAMxvxQExSTdVZ
BUkc2IbK5cxtPzUgzYVxrPe/SWk/pud1g55ywz8WJk5JVic53LjVrAc6RB4iVKFy
fh8jE8eTOVEC62lh0UtCxUl5swOpdaJjUaYe2IGhHaym0Okwmj/xEA/8cjceprxR
/aFTasCNApZ1LlEQ5Dchda9uZeuFY8mytnSG6/lH506WA284/WpLdXSnHo0+AiqJ
KZMdMrNh6xGYxvnOP2cql1ojp8bShFr38cB4t9H1vX2OCSWYld1Mm1a1zZltzeN9
VzCMn6Hu6mR9njWM8ffX2L7C53yBJ0hVKYBUWC5tiwBha/LRqHy5TdKC0eY8Z6j1
T7TN7xh3/0Z2zaWtJu8Q85F3z46eCb3I4ygwvJgDkcZzO4RM/6m08EjEs1UAi+Ov
h78zXT/sqFTOf6HcEJjloImpKqAzMmJyemS1sf2a8c1XPY8nyKKaDJ5NQbJi24d5
Q5t/WGARXBF1Qk81urH88u3qa4K4s9X2Cob5N0bpkTN7maZnUcGwoEIcTNs7Z7V8
bApSVZNKVEFFgjJ17bZjQs7SJWSO8b8CAwEAAaOB6DCB5TAOBgNVHQ8BAf8EBAMC
AQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUUUWsJop0abF4BfeV/z6MPkd6
+fgwHwYDVR0jBBgwFoAUUUWsJop0abF4BfeV/z6MPkd6+fgwRQYIKwYBBQUHAQEE
OTA3MDUGCCsGAQUFBzAChilodHRwOi8vc2Z1MTYucG9wZGF0YS5iYy5jYTo4MDAw
L3YxL3BraS9jYTA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vc2Z1MTYucG9wZGF0
YS5iYy5jYTo4MDAwL3YxL3BraS9jcmwwDQYJKoZIhvcNAQELBQADggIBAOTkmnjj
K/ho7LX/WHg+DEWOgjtBzlJ1oiKoyJktWVW8jpmHmhNJTGWwCQad/EVS3tPSGcsq
yl6C3UZDCsS7RUCRpDVzW3bqu2+MqrmB1GSecArTokfwoWOp91i0E3SeorZCs8m0
HkoAOSVsT69bUlYLaZqCJwamK4XSl+xcv7oSISHTxsKZTVdK7B6we8X2EnKrHc9n
GTdZiSUStQIYy93ObMy0UsyPIS0/5A9M1LqAP+rFZcn24PHTq8dpIVX7ip/eja/D
gkkxpyyj9m3fS3kXyutKDxSLTJUBQ9u9nVQHD6+xkg+NAYHeqpsHE/LEr1df0jHi
BYJQ4D5lpFKo876wGs6ZrFdhcU/Pf8Q9BSpBGyibN7mcJ6sSDf/k5hQpgXFa7c7J
MtmSrgnOfc847mTv/S4ks0go37uIppnJfqbYehFgwrzuuSdO1mtwFIBhNQxjb1oK
MqVfBhR8vjkSKdjy7Pnlh6xhWck9iA9J86welG67isnBM7tiqG0QuGyr4oSYg6sh
Hnyy5iYoppNXghGPqZZyL8DLG6iZNX9GAmj3jStmL/2H3MNq5YOjumbByTNqfL82
DAuGWf+l6s6RCAvYrQzKK81Ki3SqIe8M4NbKhA6fKkiD6WbdfC7O4rhqGpoA7m6+
8r1nPDWBaz8xMC4N/14MnUHmuNYcoTZ9hoi0
-----END CERTIFICATE-----' > trustcert
keytool -trustcacerts -noprompt -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass changeit -alias root -import -file trustcert


echo '
library(tictoc)
library(sparklyr)
library(dplyr)

# spark_home_set(path="/spark/spark-2.4.4")

config <- spark_config()
config$`spark.master` <- "local"
config$`spark.hadoop.fs.s3a.access.key` <- "AKIAIOSFODNN7EXAMPLE"
config$`spark.hadoop.fs.s3a.secret.key` <- "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
config$`spark.hadoop.fs.s3a.endpoint` <- "https://minio.dev16.bbsae.xyz"
config$`spark.hadoop.fs.s3a.path.style.access` <- TRUE
config$`spark.hadoop.com.amazonaws.services.s3.enableV4` <- TRUE

sc <- spark_connect (config=config)
print(sc)

tic()
p_data <- spark_read_csv (sc, name="pharmanet", path="s3a://99-t05/data/phramanet_clm_rpt_sample.csv", memory=FALSE, overwrite=TRUE)
toc()

library(dplyr)
tic()
p_data %>% 
   group_by(PC_CLNT_GENDER_LABEL) %>% 
   summarise(n = n())
toc()

' > main.r

R --no-save < main.r

```


```
library(sparklyr)
#spark_install(version = "2.1.0")
library(tictoc)

## Get/set specs of the data
number_of_columns <- length(4)
number_of_rows <- 1E3 ## way increase this to really test this out

## Create fake data
edu_data <- data.frame(sample(1:100, number_of_rows, replace=TRUE),
                       sample(seq(as.Date('1990/01/01'), as.Date('2010/01/01'), by="day"), number_of_rows, replace = TRUE),
                       sample(c("MALE", "FEMALE"), number_of_rows, replace = TRUE),
                       sample(c("E", "M", "H"), number_of_rows, replace = TRUE))
colnames(edu_data) <- c("RAW_SCORE", "BIRTHDATE", "SCHOOL_TYPE_GRP_ATTRIB", "GENDER")

library(microbenchmark)
microbenchmark::microbenchmark(
  setup = library(arrow),
  arrow_on = {
    sparklyr_df <<- copy_to(sc, edu_data, overwrite = T)
    count(sparklyr_df) %>% collect()
  },
  arrow_off = {
    if ("arrow" %in% .packages()) detach("package:arrow")
    sparklyr_df <<- copy_to(sc, edu_data, overwrite = T)
    count(sparklyr_df) %>% collect()
  },
  times = 10
) %T>% print() %>% ggplot2::autoplot()

```


```
library(sparklyr)
spark_available_versions()
```