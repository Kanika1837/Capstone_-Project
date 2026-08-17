<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Swap Skill - Learn, Share & Grow</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            background: #fff5f8;
            color: #333;
        }

        /* NAVBAR */
        nav {
            width: 100%;
            padding: 18px 7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ffffff;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #e75480;
            text-decoration: none;
        }

        .logo span {
            color: #333;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 28px;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: #333;
            font-size: 15px;
            font-weight: 600;
            transition: 0.3s;
        }

        .nav-links a:hover {
            color: #e75480;
        }

        .login-btn {
            border: 2px solid #e75480;
            padding: 9px 18px;
            border-radius: 25px;
            color: #e75480 !important;
        }

        .login-btn:hover {
            background: #e75480;
            color: white !important;
        }

        .signup-btn {
            background: #e75480;
            color: white !important;
            padding: 10px 20px;
            border-radius: 25px;
        }

        .signup-btn:hover {
            background: #d94370;
        }

        /* HERO SECTION */
        .hero {
            min-height: 88vh;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 70px 8%;
            gap: 50px;
            background: linear-gradient(
                135deg,
                #fff5f8,
                #ffe4ed,
                #fff
            );
        }

        .hero-content {
            max-width: 600px;
        }

        .small-title {
            display: inline-block;
            background: #ffd8e5;
            color: #d94370;
            padding: 9px 18px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 22px;
        }

        .hero h1 {
            font-size: 58px;
            line-height: 1.1;
            color: #2d2d2d;
            margin-bottom: 20px;
        }

        .hero h1 span {
            color: #e75480;
        }

        .hero p {
            font-size: 18px;
            line-height: 1.7;
            color: #666;
            margin-bottom: 30px;
        }

        .hero-buttons {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .primary-btn {
            display: inline-block;
            padding: 14px 28px;
            background: #e75480;
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: 0.3s;
            box-shadow: 0 8px 20px rgba(231, 84, 128, 0.25);
        }

        .primary-btn:hover {
            transform: translateY(-3px);
            background: #d94370;
        }

        .secondary-btn {
            display: inline-block;
            padding: 13px 28px;
            border: 2px solid #e75480;
            color: #e75480;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: 0.3s;
        }

        .secondary-btn:hover {
            background: #e75480;
            color: white;
        }

        /* HERO CARD */
        .hero-visual {
            width: 430px;
            min-width: 350px;
            position: relative;
        }

        .main-card {
            background: white;
            padding: 35px;
            border-radius: 30px;
            box-shadow: 0 20px 50px rgba(231, 84, 128, 0.15);
            text-align: center;
        }

        .main-card-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: #ffe0ea;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }

        .main-card h2 {
            color: #333;
            margin-bottom: 12px;
        }

        .main-card p {
            color: #777;
            line-height: 1.6;
        }

        .skill-boxes {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 25px;
        }

        .skill-box {
            background: #fff0f5;
            color: #d94370;
            padding: 9px 15px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
        }

        /* HOW IT WORKS */
        .section {
            padding: 80px 8%;
            text-align: center;
            background: white;
        }

        .section-title {
            font-size: 36px;
            color: #333;
            margin-bottom: 12px;
        }

        .section-subtitle {
            color: #777;
            margin-bottom: 45px;
            font-size: 16px;
        }

        .steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }

        .step-card {
            padding: 35px 25px;
            border-radius: 20px;
            background: #fff7fa;
            transition: 0.3s;
        }

        .step-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(231, 84, 128, 0.12);
        }

        .step-number {
            width: 55px;
            height: 55px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: #e75480;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
        }

        .step-card h3 {
            margin-bottom: 12px;
            color: #333;
        }

        .step-card p {
            color: #777;
            line-height: 1.6;
        }

        /* COMMUNITY */
        .community {
            padding: 80px 8%;
            text-align: center;
            background: #ffe9f0;
        }

        .community h2 {
            font-size: 38px;
            margin-bottom: 15px;
        }

        .community p {
            max-width: 650px;
            margin: 0 auto 30px;
            color: #666;
            line-height: 1.7;
        }

        /* FOOTER */
        footer {
            background: #2d2d2d;
            color: white;
            padding: 30px 8%;
            text-align: center;
        }

        footer .footer-logo {
            color: #ff9fbd;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        footer p {
            color: #ccc;
            font-size: 14px;
        }

        /* MOBILE */
        @media (max-width: 900px) {

            .nav-links {
                gap: 12px;
            }

            .nav-links a {
                font-size: 12px;
            }

            .hero {
                flex-direction: column;
                text-align: center;
                padding-top: 60px;
            }

            .hero-buttons {
                justify-content: center;
            }

            .hero h1 {
                font-size: 45px;
            }

            .hero-visual {
                width: 100%;
                max-width: 430px;
            }

            .steps {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {

            nav {
                flex-direction: column;
                gap: 15px;
            }

            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }

            .hero h1 {
                font-size: 38px;
            }

            .hero p {
                font-size: 16px;
            }

            .hero-buttons {
                flex-direction: column;
            }

            .primary-btn,
            .secondary-btn {
                width: 200px;
            }
        }
    </style>
</head>

<body>

    <!-- NAVIGATION BAR -->
    <nav>

        <a href="index.html" class="logo">
            Swap<span>Skill</span>
        </a>

        <ul class="nav-links">

            <li>
                <a href="index.html">Home</a>
            </li>

            <li>
                <a href="skills.html">Expose Skills</a>
            </li>

            <li>
                <a href="#how-it-works">How We Work</a>
            </li>

            <li>
                <a href="#community">Community</a>
            </li>

            <li>
                <a href="#about">About Us</a>
            </li>

            <li>
                <a href="login.html" class="login-btn">Login</a>
            </li>

            <li>
                <a href="signup.html" class="signup-btn">Sign Up</a>
            </li>

        </ul>

    </nav>


    <!-- HERO SECTION -->
    <section class="hero">

        <div class="hero-content">

            <div class="small-title">
                ✨ Learn • Share • Grow
            </div>

            <h1>
                Learn skills.<br>
                <span>Share skills.</span><br>
                Grow together.
            </h1>

            <p>
                SwapSkill is a skill-sharing platform where you can
                teach what you know, learn what you love, and connect
                with people who share your interests.
            </p>

            <div class="hero-buttons">

                <a href="signup.html" class="primary-btn">
                    Get Started →
                </a>

                <a href="skills.html" class="secondary-btn">
                    Explore Skills
                </a>

            </div>

        </div>


        <!-- RIGHT SIDE CARD -->
        <div class="hero-visual">

            <div class="main-card">

                <div class="main-card-icon">
                    🔄
                </div>

                <h2>
                    Skill Exchange
                </h2>

                <p>
                    Your knowledge can help someone,
                    and someone else's knowledge can
                    help you.
                </p>

                <div class="skill-boxes">

                    <div class="skill-box">
                        Java
                    </div>

                    <div class="skill-box">
                        Python
                    </div>

                    <div class="skill-box">
                        Web Design
                    </div>

                    <div class="skill-box">
                        UI/UX
                    </div>

                    <div class="skill-box">
                        Communication
                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- HOW WE WORK -->
    <section class="section" id="how-it-works">

        <h2 class="section-title">
            How We Work
        </h2>

        <p class="section-subtitle">
            Start learning and sharing in three simple steps.
        </p>

        <div class="steps">

            <div class="step-card">

                <div class="step-number">
                    01
                </div>

                <h3>
                    Create Your Profile
                </h3>

                <p>
                    Sign up and add the skills you can teach
                    and the skills you want to learn.
                </p>

            </div>


            <div class="step-card">

                <div class="step-number">
                    02
                </div>

                <h3>
                    Find Your Match
                </h3>

                <p>
                    Our platform helps you discover people
                    whose skills match your learning goals.
                </p>

            </div>


            <div class="step-card">

                <div class="step-number">
                    03
                </div>

                <h3>
                    Connect & Learn
                </h3>

                <p>
                    Send a request, connect with your match,
                    and start sharing knowledge.
                </p>

            </div>

        </div>

    </section>


    <!-- COMMUNITY -->
    <section class="community" id="community">

        <h2>
            Learn Together. Grow Together.
        </h2>

        <p>
            Join a growing community of learners and
            skill providers. Share your knowledge,
            discover new talents, and build meaningful
            learning connections.
        </p>

        <a href="signup.html" class="primary-btn">
            Join the Community
        </a>

    </section>


    <!-- ABOUT US -->
    <section class="section" id="about">

        <h2 class="section-title">
            About SwapSkill
        </h2>

        <p class="section-subtitle">
            SwapSkill is designed to make peer-to-peer
            learning simple, accessible, and collaborative.
            Instead of only consuming knowledge, users can
            both teach and learn.
        </p>

    </section>


    <!-- FOOTER -->
    <footer>

        <div class="footer-logo">
            SwapSkill
        </div>

        <p>
            Learn skills • Share skills • Grow together
        </p>

        <p>
            © 2026 SwapSkill. All Rights Reserved.
        </p>

    </footer>

</body>
</html>