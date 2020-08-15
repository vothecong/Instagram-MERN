const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const key = require("../configs/KEYS").KEY_SECRET;
const passport = require("passport");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: key,
    },
    async (payload, done) => {
      try {
        const user = await User.findById({ _id: payload.sub });
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          // return done(null, false, { message: "Tai khoan khong ton tai!!!" });
          //listerror
          return done(
            null,
            false,
            req.flash("listerror", "Tai khoan khong ton tai!!!")
          );
        }
        const validatePass = await user.validatePassword(password);
        if (!validatePass) {
          // return done(null, false, { message: "Mat khau khong chinh xac!!!" });
          return done(
            null,
            false,
            req.flash("listerror", "Mat khau khong chinh xac!!!")
          );
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById({ _id: id }, (id, user) => {
    done(err, user);
  });
});
