<h1 align="center">Welcome HTTP Interceptor</h2>

[<img width="1003" alt="Inssman logo" src="https://github.com/vvmgev/Inssman/assets/11613729/adfe9084-5c0c-4a81-afbb-2d41f02af315">](https://chromewebstore.google.com/detail/inssman-modify-http-heade/ghlpdbkhlenlfiglgphledhfhchjfjfk)

<a href="https://chromewebstore.google.com/detail/inssman-modify-http-heade/ghlpdbkhlenlfiglgphledhfhchjfjfk">Install Inssman For Google Chrome</a>


# | Introduction ℹ️ 
### HTTP Interceptor browser extensions makes your development life easy.
This extension designed for developers. HTTP Interceptor built the top of last API's which gives you control over HTTP responses and requests.
<br />

By creating a single **Rule** you can.
- **[Redirect Request](#redirect)** to another url
- **[Block Request](#block)**
- **[Modify Query Parameters](#query-param)** like add/remove/replace
- **[Modify Request Header](#modify-header)** like add/remove/append
- **[Modify Response Header](#modify-header)** like add/remove/append
- **[Modify Response](#modify-response)** allows return response such as HTML/CSS/JS/JSON file

<a name="documentation"></a>
# | Documentation 📚 
<a name="redirect"></a>

### **Redirect Request** 🔀 
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL** which need to redirect
3. Insert the **URL** where need to redirect
4. Press **Create**


[<img width="1003" alt="Screenshot 2023-01-18 at 14 41 37" src="https://user-images.githubusercontent.com/11613729/213155378-5eeefa8e-d389-4da9-8890-2d1930b9d74c.png">](https://youtu.be/5ln4m-Ybgns)

<a name="block"></a>

### **Block Request** 🚫 
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Press **Create**


[<img width="1503" alt="Screenshot 2023-01-18 at 14 34 59" src="https://user-images.githubusercontent.com/11613729/213155459-f966a084-bdab-4ca2-96bd-0f27e8f1a326.png">](https://youtu.be/zlh_3kZjYGM)


<a name="query-param"></a>

### **Modify Query Parameters** ❔
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Choose **Action Operator**
5. Insert header **Key**
6. Insert header **Value**
7. Press **Create**

[<img width="1503" alt="Screenshot 2023-01-18 at 14 14 38" src="https://user-images.githubusercontent.com/11613729/213155600-7fd84b43-6e50-4afc-a317-3bf979542087.png">](https://youtu.be/zM-yWfZPIwI)


<a name="modify-header"></a>

### **Modify Header** 🌐
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the URL you want to add/remove/append params
4. Choose **Action Operator**
4. Choose **Request/Response** 
5. Insert header **Key**
6. Insert header **Value**
7. Press **Create**
 
[<img width="1503" alt="Screenshot 2023-01-18 at 14 45 42" src="https://user-images.githubusercontent.com/11613729/213155724-926ca40f-7dd4-4ef5-98fb-06149d4b6d04.png">](https://youtu.be/VPO0sut2IHM)


<a name="modify-response"></a>

### **Modify Response** 🗞️ 
1. Insert **Rule** name
2. Choose **Match Operator** [(see details)](#matcOperator)
3. Insert the **URL**
4. Insert header **Key**
5. Insert header **Value**
6. Press **Create**

[<img width="1503" alt="Screenshot 2023-01-18 at 14 49 52" src="https://user-images.githubusercontent.com/11613729/213155984-d29d3a48-41fb-4ff2-aa33-257898400ecc.png">](https://youtu.be/d3GU5e1jq7I)

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
URL &nbsp;&nbsp; - <span>http://</span><span>w</span>ww.example.com/ \
Result - No Match ❌

Word &nbsp;- example.com \
URL &nbsp;&nbsp; - <span>http://</span>example.com/user \
Result - No Match ❌


<!-- ## Regexp operator -->

<!-- Regexp operator uses the **regular expression** to match the URL

Examples ⬇️

Word &nbsp;- ^http:\/\/example\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.com** \
Result - Match ✅ 

Word &nbsp;- ^http(s)?:\/\/example\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.com** \
Result - Match ✅ 

Word &nbsp;- ^http:\/\/example\\.(abc|def)\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>**example.abc.com** \
Result - Match ✅ 

Word &nbsp;- ^https:\/\/example\\-1\\.(abc|def)\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>https://</span>**example.abc.com** \
Result - Match ✅ 

Word &nbsp;- http(s)?:\/\/example-([1-5])\.com \
URL &nbsp;&nbsp; - <span>http://</span>**example-1.com** \
Result - Match ✅ 

Word &nbsp;- ^http:\/\/example\\.com\\/?$ \
URL &nbsp;&nbsp; - <span>http://</span>example.net \
Result - No Match ❌

Word &nbsp;- http(s)?:\/\/example-([1-5])\.com \
URL &nbsp;&nbsp; - <span>http://</span>example-7.com \
Result - No Match ❌

For **[Redirect Request](#redirectRequest)** there is more powerful options. Each matched group can be replaced in some parts of the destination URL. Each backslash number (\\1 or \\2) can be replaced accordingly

Examples ⬇️

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- https:\\/\\/(example\\-abc)\\.(example\\-def)\\.com \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>https://</span>**example-1.example-2.com** \
Matches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - \1 = example-abc, \2 = example-def \
Destination&nbsp; &nbsp; &nbsp; &nbsp; - <span>https://</span>googl.com/\\1/\\2 \
Redirected URL  - <span>https://</span>google.com/example-abc/example-def \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Match ✅  -->


## Wilcard operator

Wilcard operator uses the **asterisk (*)** to match the URL

Examples ⬇️

Word &nbsp;- \*example\* \
URL &nbsp;&nbsp; - <span>http://</span>**example**.com \
Result - Match ✅ 

Word &nbsp;- https://*example.com \
URL &nbsp;&nbsp; - <span>https://</span><span>w</span><span>ww.</span>**example.com** \
Result - Match ✅ 


For **[Redirect Request](#redirectRequest)** there is more powerful options. Each match with asterisk can be replaced in some parts of the destination URL **$[number]**

Examples ⬇️

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span>https://<span>example.com/\*/\*/\* \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>**https://</span>example.com**/article/edit/12 \
Matches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - $1 = article, $2 = edit, $3 = 12 \
Destination&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span>https://</span>google.com/$1/$2/$3 \
Redirected URL - <span>https://</span>google.com/article/edit/12 \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Match ✅ 

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- \*://\*\.example.com/\* \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>**https://</span><span>w</span><span>ww.**</span>**example.com**/?age=12&gender=male \
Matches&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - $1 = http, $2 = www, $3 = ?age=12&gender=male \
Destination&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span>https://</span>google.com/$1/$2/$3 \
Redirected URL - <span>https://</span>google.com/https/www/?id=12&gender=male \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Match ✅

Word&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span>https://<span>example.com/\*/\*/\* \
URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - <span>https://</span><span>w</span><span>ww.</span>example.com/article/edit/12 \
Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- No Match ❌
