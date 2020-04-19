<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'fullcontact' );

/** MySQL database username */
define( 'DB_USER', 'fingent' );

/** MySQL database password */
define( 'DB_PASSWORD', 'fingent123' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'z2GvKVcYAcJxS&46]GQ(R&dWs*/PXvpfwaj(Vxz|M^/#zw;@~9kP161(([m%5n39' );
define( 'SECURE_AUTH_KEY',  'wf9{iLTw,Wthv/6SVlNS71b1 Avl5ZW[<6I_$}9G$!bX_4m[`!k2#>d$[;j}p)29' );
define( 'LOGGED_IN_KEY',    'd]Meg):Sy-V,rz.Fwp_e+R=k~#e$nyk_Go_7#~Qj|(qVu+oH6A]SGg?tUsj?kas^' );
define( 'NONCE_KEY',        '01Hh@6:[ }y=,ke,J7@iGvt*2d;E>)BVz%Ko&T!~}=p8o]]t:U$<wMmuF4VGuo)q' );
define( 'AUTH_SALT',        'zJhDI)BOK%9t%oR2z}6>-j=9:Ln)E^,QP,7aIolEQ6%wU<#y[c:B[w$gzf;~~Dcu' );
define( 'SECURE_AUTH_SALT', 'l=@Q_TNE1w%];FMo^tzS(iFu(ZVXw-H9TnWY 53#Q}g@L#}w3_A}%>{`k.JOFtU}' );
define( 'LOGGED_IN_SALT',   '2J%ctU-_ee)>p/,Z4)Z]?7F.<CaO~tEM8;;_ra:@Z1<27*Cas#g+ T=BN6T9xbTb' );
define( 'NONCE_SALT',       'i:;Xd-ZYpY$m639ku.Q5WcHt2E?O3)o ]_(U0YP[/XtpF3DSoi?d?4NIK+tx$DT!' );
define('FS_METHOD', 'direct');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
