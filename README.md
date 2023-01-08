<h1 align="center">Welcome HTTP Interceptor</h2>


# | Introduction ℹ️ 
### HTTP Interceptor browser extensions makes your development life easy.
This extension designed for developers. HTTP Interceptor built the top of last API's which gives you control over HTTP responses and requests.
<br />

By creating a single **Rule** you can.
- **[Redirect Request](#redirectRequest)** to another url
- **[Block Request](#redirectRequest)**
- **[Modify Query Parameters](#modifyQueryParameters)** like add/remove/replace
- **[Modify Request Header](#modifyRequestHeader)** like add/remove/append
- **[Modify Response Header](#modifyResponseHeader)** like add/remove/append
- **[Modify Response](#modifyResponse)** allows return response such as HTML/CSS/JS/JSON file

# | Documentation 📚 
<a name="redirectRequest"></a>

### **Redirect Request**
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL** which need to redirect
3. Insert the **URL** where need to redirect
4. Press **Create**

<img width="1053" alt="Screenshot 2023-01-07 at 20 13 19" src="https://user-images.githubusercontent.com/11613729/211160525-7d13a8ad-cd34-4175-bf1c-da7422575f6d.png">

<a name="blockRequest"></a>

### **Block Request**
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Press **Create**

<img width="1053" alt="Screenshot 2023-01-07 at 20 28 31" src="https://user-images.githubusercontent.com/11613729/211160790-7740364a-4c47-479a-88f6-ec1e7ae39fff.png">

<a name="modifyQueryParameters"></a>

### **Modify Query Parameters**
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Choose **Action Operator**
5. Insert header **Key**
6. Insert header **Value**
7. Press **Create**

<img width="1053" alt="Screenshot 2023-01-07 at 20 11 32" src="https://user-images.githubusercontent.com/11613729/211160722-e244205b-0276-419e-8fdb-66a4144a75b4.png">

<a name="modifyHeader"></a>

### **Modify Header**
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the URL you want to add/remove/append params
4. Choose **Action Operator**
4. Choose **Request/Response** 
5. Insert header **Key**
6. Insert header **Value**
7. Press **Create**
 
<img width="1053" alt="Screenshot 2023-01-07 at 20 15 21" src="https://user-images.githubusercontent.com/11613729/211160557-1835bf58-0e01-4b6d-a400-e36d84c7f7c4.png">

<a name="modifyResponse"></a>

### **Modify Response**
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Insert header **Key**
5. Insert header **Value**
6. Press **Create**

<img width="1053" alt="Screenshot 2023-01-07 at 20 16 51" src="https://user-images.githubusercontent.com/11613729/211160363-e3e40664-8c37-4a9d-8f11-dcdf07cb9a00.png">

<br /><br />
<a name="matcOperator"></a>

# **| Match Operators ✨**

## Contain operator

Contain operator searches provided word in the whole URL

Examples ⬇️

Word &nbsp;- user \
URL &nbsp;&nbsp; - <span>http://</span>example.com/**user** \
Result - Match ✅ 

Word &nbsp; - user \
URL &nbsp;&nbsp; - <span>http://</span>example.com/?key=**user** \
Result - Match ✅ 

Word &nbsp;- user \
URL &nbsp;&nbsp; - <span>http://</span>**user**.com/ \
Result - Match ✅ 

Word &nbsp;- user \
URL &nbsp;&nbsp; - <span>http://</span>example.com/ \
Result - No Match ❌

## Equal operator

Equal Operator is strict matching action however this operator is ignore the **protocol (http or https)** and last **slash (/)** end of the URL

Examples ⬇️

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>**example.com** \
Result - Match ✅ 

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>**example.com**/ \
Result - Match ✅ 

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>https://</span>**example.com**/ \
Result - Match ✅ 

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>**example.com**/ \
Result - Match ✅ 

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>www.example.com/ \
Result - No Match ❌

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>example.com/user \
Result - No Match ❌


## Regexp operator

Regexp operator uses the **regular expression** to match the URL

Examples ⬇️

Word &nbsp;- ^http:\\/\\/example\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.com** \
Result - Match ✅ 

Word &nbsp;- ^http(s)?:\\/\\/example\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.com** \
Result - Match ✅ 

Word &nbsp;- ^http:\\/\\/example\\.(abc|def)\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.abc.com** \
Result - Match ✅ 

Word &nbsp;- ^https:\\/\\/example\\-1\\.(abc|def)\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>https://</span>**example.abc.com** \
Result - Match ✅ 

Word &nbsp;- http(s)?:\/\/example-([1-5])\.com \
URL &nbsp;&nbsp; - <span>http://</span>**example-1.com** \
Result - Match ✅ 

Word &nbsp;- ^https:\/\/example\.com\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>example.net \
Result - No Match ❌

Word &nbsp;- http(s)?:\/\/example-([1-5])\.com \
URL &nbsp;&nbsp; - <span>http://</span>**example-7.com** \
Result - No Match ❌

For **[Redirect Request](#redirectRequest)** there is more powerful options. Each matched group can be replaced in some parts of the destination URL. Each backslash number (\\1 or \\2) can be replaced accordingly

Examples ⬇️

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- https:\\/\\/(example\\-abc)\\.(example\\-def)\\.com \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>https://</span>**example-1.example-2.com** \
Matches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - \1 = example-abc, \2 = example-def \
Destination&nbsp; &nbsp; &nbsp; &nbsp; - <span>https://</span>googl.com/\\1/\\2 \
Redirected URL  - <span>https://</span>google.com/example-abc/example-def \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Match ✅ 


## Wilcard operator

Wilcard operator uses the **asterisk (*)** to match the URL

Examples ⬇️

Word &nbsp;- \*example\* \
URL &nbsp;&nbsp; - <span>http://</span>**example**.com \
Result - Match ✅ 

Word &nbsp;- https://*example.com \
URL &nbsp;&nbsp; - <span>https://</span>**www.example.com** \
Result - Match ✅ 

Wilcard operator also has the same options as Regexp operator. \
Each asterisk can be replaced backslash number (\\1 or \\2).

Example ⬇️

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- \*://\*\.example.com/\* \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>https://</span>**www.example.com**/?age=12&gender=male \
Matches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - \1 = http, \2 = www, \3 = ?age=12&gender=male \
Destination&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span>https://</span>google.com/\1/\2/\3 \
Redirected URL - <span>https://</span>google.com/https/www/?id=12&gender=male \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Match ✅ 




